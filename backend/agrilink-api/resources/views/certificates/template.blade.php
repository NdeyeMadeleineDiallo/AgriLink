<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificat AgriLink</title>

    <style>
        @page {
            margin: 18px;
        }

        body {
            margin: 0;
            padding: 0;
            background: #f8fafc;
            font-family: DejaVu Sans, sans-serif;
            color: #102033;
        }

        .certificate {
            position: relative;
            min-height: 735px;
            background: #fffdf7;
            border: 5px solid #d4af37;
            padding: 18px;
        }

        .inner {
            min-height: 690px;
            border: 2px solid #0f8a3b;
            padding: 24px 48px 18px;
            text-align: center;
            position: relative;
        }

        .corner-top-left,
        .corner-bottom-right {
            position: absolute;
            width: 120px;
            height: 120px;
            background: #064e3b;
        }

        .corner-top-left {
            top: 0;
            left: 0;
            border-right: 6px solid #d4af37;
            border-bottom: 6px solid #d4af37;
        }

        .corner-bottom-right {
            bottom: 0;
            right: 0;
            border-left: 6px solid #d4af37;
            border-top: 6px solid #d4af37;
        }

        .logo {
            width: 210px;
            margin-top: 8px;
            margin-bottom: 18px;
        }

        .academy {
            font-size: 17px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #065f46;
            text-transform: uppercase;
        }

        .ornament {
            margin: 12px auto 18px;
            width: 230px;
            border-top: 2px solid #d4af37;
        }

        .title-main {
            font-size: 56px;
            font-weight: bold;
            letter-spacing: 3px;
            color: #064e3b;
            line-height: 1;
            text-transform: uppercase;
        }

        .title-sub {
            margin-top: 7px;
            font-size: 38px;
            font-weight: bold;
            letter-spacing: 3px;
            color: #c98b1f;
            text-transform: uppercase;
        }

        .subtitle {
            margin-top: 22px;
            font-size: 15px;
            color: #334155;
        }

        .student-name {
            margin-top: 14px;
            font-size: 46px;
            font-weight: bold;
            font-style: italic;
            color: #f97316;
            line-height: 1.1;
        }

        .divider {
            margin: 12px auto 0;
            width: 420px;
            border-top: 1px solid #d4af37;
        }

        .course-intro {
            margin-top: 16px;
            font-size: 15px;
            color: #334155;
        }

        .course-title {
            margin-top: 9px;
            font-size: 25px;
            font-weight: bold;
            color: #047857;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .description {
            margin: 12px auto 0;
            width: 82%;
            font-size: 12.5px;
            line-height: 1.65;
            color: #334155;
        }

        .details {
            margin-top: 25px;
            width: 100%;
            text-align: center;
        }

        .info-box {
            display: inline-block;
            width: 250px;
            background: #f8fafc;
            border: 1px solid #ead7a1;
            padding: 13px 10px;
            vertical-align: middle;
            font-size: 11px;
            color: #475569;
        }

        .info-box strong {
            display: block;
            margin-top: 6px;
            font-size: 12px;
            color: #0f172a;
        }

        .seal {
            display: inline-block;
            width: 112px;
            height: 112px;
            border-radius: 50%;
            background: #065f46;
            border: 8px solid #d4af37;
            color: white;
            vertical-align: middle;
            margin: 0 34px;
            text-align: center;
            font-weight: bold;
            box-sizing: border-box;
            padding-top: 17px;
            font-size: 11px;
            line-height: 1.35;
        }

        .seal-star {
            font-size: 24px;
            color: #facc15;
            line-height: 1;
            margin-bottom: 4px;
        }

        .signatures {
            margin-top: 34px;
            width: 100%;
            text-align: center;
        }

        .signature-box {
            display: inline-block;
            width: 270px;
            text-align: center;
            vertical-align: top;
            margin: 0 45px;
        }

        .signature {
            font-size: 27px;
            font-style: italic;
            color: #111827;
            line-height: 1;
        }

        .signature-line {
            width: 170px;
            border-top: 1px solid #d4af37;
            margin: 10px auto 0;
        }

        .role {
            margin-top: 7px;
            font-size: 11px;
            color: #475569;
        }

        .footer-line {
            margin: 26px auto 0;
            width: 520px;
            border-top: 1px solid #d4af37;
        }

        .footer {
            margin-top: 10px;
            font-size: 11px;
            color: #334155;
            line-height: 1.6;
        }

        .verification {
            font-weight: bold;
            color: #047857;
        }
    </style>
</head>

<body>
    <div class="certificate">
        <div class="corner-top-left"></div>
        <div class="corner-bottom-right"></div>

        <div class="inner">
            <img class="logo" src="{{ public_path('images/agrilink-logo.png') }}" alt="AgriLink">

            <div class="academy">
                AgriLink by AgriAcademy
            </div>

            <div class="ornament"></div>

            <div class="title-main">
                Certificat
            </div>

            <div class="title-sub">
                de réussite
            </div>

            <div class="subtitle">
                Ce certificat est officiellement décerné à
            </div>

            <div class="student-name">
                {{ $user->name }}
            </div>

            <div class="divider"></div>

            <div class="course-intro">
                pour avoir terminé avec succès la formation
            </div>

            <div class="course">
    @if(!empty($isFinalCertificate))
        PARCOURS COMPLET EN ENTREPRENEURIAT AGRICOLE
    @else
        {{ $course->title }}
    @endif
</div>

            <div class="description">
                Ce certificat atteste que l’apprenant a suivi et validé le parcours de formation,
                et démontré les compétences nécessaires dans les bonnes pratiques agricoles,
                la gestion culturale, la production durable et l’entrepreneuriat agricole.
            </div>

            <div class="details">
                <div class="info-box">
                    N° CERTIFICAT
                    <strong>{{ $certificate->certificate_number }}</strong>
                </div>

                <div class="seal">
                    <div class="seal-star">★</div>
                    AGRILINK<br>
                    ACADEMY<br>
                    CERTIFIÉ
                </div>

                <div class="info-box">
                    ÉMIS LE
                    <strong>{{ $certificate->issued_at->format('d/m/Y') }}</strong>
                </div>
            </div>

            <div class="signatures">
                <div class="signature-box">
                    <div class="signature">AgriAcademy</div>
                    <div class="signature-line"></div>
                    <div class="role">Responsable pédagogique</div>
                </div>

                <div class="signature-box">
                    <div class="signature">AgriLink</div>
                    <div class="signature-line"></div>
                    <div class="role">Direction générale</div>
                </div>
            </div>

            <div class="footer-line"></div>

            <div class="footer">
                Vérification en ligne sur :
                <span class="verification">agrilink.sn/verification</span><br>
                Dakar, Sénégal — Numéro unique :
                {{ $certificate->certificate_number }}
            </div>
        </div>
    </div>
</body>
</html>