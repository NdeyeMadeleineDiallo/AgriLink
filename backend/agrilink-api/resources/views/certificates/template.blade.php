<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificat AgriLink</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            background: #f8fafc;
            color: #0f172a;
            padding: 40px;
        }

        .certificate {
            border: 8px solid #16a34a;
            padding: 50px;
            background: white;
            text-align: center;
        }

        .brand {
            color: #16a34a;
            font-size: 28px;
            font-weight: bold;
        }

        .title {
            font-size: 42px;
            margin-top: 40px;
            font-weight: bold;
        }

        .subtitle {
            margin-top: 20px;
            font-size: 18px;
            color: #475569;
        }

        .name {
            margin-top: 35px;
            font-size: 32px;
            font-weight: bold;
            color: #f97316;
        }

        .course {
            margin-top: 25px;
            font-size: 24px;
            font-weight: bold;
        }

        .footer {
            margin-top: 60px;
            font-size: 13px;
            color: #64748b;
        }

        .number {
            margin-top: 25px;
            font-size: 13px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="brand">AgriLink by AgriAcademy</div>

        <div class="title">Certificat de réussite</div>

        <div class="subtitle">
            Ce certificat est décerné à
        </div>

        <div class="name">
            {{ $user->name }}
        </div>

        <div class="subtitle">
            pour avoir terminé avec succès la formation :
        </div>

        <div class="course">
            {{ $course->title }}
        </div>

        <div class="number">
            Numéro du certificat : {{ $certificate->certificate_number }}
        </div>

        <div class="footer">
            Délivré le {{ $certificate->issued_at->format('d/m/Y') }} — Dakar, Sénégal
        </div>
    </div>
</body>
</html>