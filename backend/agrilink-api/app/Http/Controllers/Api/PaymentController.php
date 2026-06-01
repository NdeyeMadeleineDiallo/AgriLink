<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\UserSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function manualPayment(Request $request)
    {
        $validated = $request->validate([
            'subscription_id' => ['required', 'exists:subscriptions,id'],
            'payment_method' => ['required', 'in:wave,orange_money,manual'],
        ]);

        $subscription = Subscription::findOrFail($validated['subscription_id']);

        $payment = Payment::create([
            'user_id' => $request->user()->id,
            'subscription_id' => $subscription->id,
            'amount' => $subscription->price,
            'payment_method' => $validated['payment_method'],
            'transaction_reference' => 'PAY-' . now()->format('YmdHis') . '-' . strtoupper(Str::random(6)),
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        UserSubscription::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'subscription_id' => $subscription->id,
            ],
            [
                'start_date' => now()->toDateString(),
                'end_date' => now()->addDays($subscription->duration_days)->toDateString(),
                'status' => 'active',
            ]
        );

        return response()->json([
            'message' => 'Paiement enregistré avec succès.',
            'payment' => $payment,
        ], 201);
    }

    public function mySubscription(Request $request)
    {
        $subscription = UserSubscription::with('subscription')
            ->where('user_id', $request->user()->id)
            ->where('status', 'active')
            ->latest()
            ->first();

        return response()->json([
            'subscription' => $subscription,
        ]);
    }

    public function payments()
    {
        return response()->json(
            Payment::with(['user', 'subscription'])->latest()->paginate(10)
        );
    }
}