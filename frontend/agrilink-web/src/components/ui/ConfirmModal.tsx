export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-950">{title}</h2>

        <p className="mt-3 leading-7 text-slate-600">{message}</p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}