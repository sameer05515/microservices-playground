<%@ page contentType="text/html;charset=UTF-8" %>

<!DOCTYPE html>
<html>
<head>

    <title>Spring Boot JSP Demo</title>

    <style>

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            min-height: 100vh;

            display: flex;
            justify-content: center;
            align-items: center;

            font-family: Arial, Helvetica, sans-serif;

            background: linear-gradient(
                    135deg,
                    #4facfe,
                    #667eea,
                    #8e54e9
            );
        }

        .container {
            width: 500px;

            padding: 45px;

            background: rgba(255, 255, 255, 0.95);

            border-radius: 25px;

            text-align: center;

            box-shadow:
                    0 25px 60px rgba(0, 0, 0, 0.25);

            animation: entry 0.7s ease-out;
        }

        @keyframes entry {

            from {
                opacity: 0;
                transform: translateY(40px) scale(0.95);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .icon {
            font-size: 55px;

            margin-bottom: 15px;

            animation: bounce 2s infinite;
        }

        @keyframes bounce {

            0%, 100% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-8px);
            }
        }

        h1 {
            color: #202938;

            margin-bottom: 10px;

            font-size: 32px;
        }

        .subtitle {
            color: #6b7280;

            margin-bottom: 35px;
        }

        .menu {
            display: flex;

            flex-direction: column;

            gap: 15px;
        }

        .menu a {
            display: block;

            padding: 16px 20px;

            border-radius: 12px;

            text-decoration: none;

            color: white;

            font-size: 18px;

            font-weight: bold;

            background: linear-gradient(
                    90deg,
                    #2196f3,
                    #7c3aed
            );

            box-shadow:
                    0 8px 20px rgba(99, 102, 241, 0.3);

            transition:
                    transform 0.2s,
                    box-shadow 0.2s;
        }

        .menu a:hover {
            transform: translateY(-3px);

            box-shadow:
                    0 12px 25px rgba(99, 102, 241, 0.45);
        }

        .menu a:active {
            transform: scale(0.98);
        }

        .footer {
            margin-top: 30px;

            color: #9ca3af;

            font-size: 14px;
        }

    </style>

</head>

<body>

<div class="container">

    <div class="icon">
        🧮
    </div>

    <h1>
        Spring Boot JSP Demo
    </h1>

    <p class="subtitle">
        Welcome! Choose a page to continue.
    </p>

    <div class="menu">

        <a href="${pageContext.request.contextPath}/home">
            🏠 Home
        </a>

        <a href="${pageContext.request.contextPath}/calculator">
            ➕ Calculator
        </a>

    </div>

    <div class="footer">
        JSP + Spring Boot
    </div>

</div>

</body>

</html>