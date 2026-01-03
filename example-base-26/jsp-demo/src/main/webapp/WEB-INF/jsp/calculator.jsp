<%@ page contentType="text/html;charset=UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <title>Add Numbers</title>

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

            overflow: hidden;
        }

        /* Floating mathematical symbols */

        body::before,
        body::after {
            content: "+    ×    −    ÷";
            position: absolute;

            font-size: 80px;
            font-weight: bold;

            color: rgba(255, 255, 255, 0.12);

            letter-spacing: 80px;

            animation: float 8s ease-in-out infinite;
        }

        body::before {
            top: 10%;
            left: 5%;
        }

        body::after {
            bottom: 10%;
            right: 5%;

            animation-delay: -4s;
        }

        @keyframes float {

            0%, 100% {
                transform: translateY(0) rotate(0deg);
            }

            50% {
                transform: translateY(-25px) rotate(5deg);
            }
        }


        /* Main Card */

        .calculator {
            position: relative;
            z-index: 1;

            width: 450px;

            padding: 45px;

            background: rgba(255, 255, 255, 0.95);

            border-radius: 25px;

            box-shadow:
                    0 25px 60px rgba(0, 0, 0, 0.25);

            animation: cardEntry 0.8s ease-out;
        }

        @keyframes cardEntry {

            from {
                opacity: 0;
                transform: translateY(50px) scale(0.9);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }


        /* Heading */

        h1 {
            text-align: center;

            color: #202938;

            margin-bottom: 10px;

            font-size: 32px;
        }

        .subtitle {
            text-align: center;

            color: #6b7280;

            margin-bottom: 35px;

            font-size: 15px;
        }


        /* Input group */

        .input-group {
            margin-bottom: 22px;
        }

        label {
            display: block;

            margin-bottom: 8px;

            font-size: 16px;

            font-weight: bold;

            color: #293241;
        }

        input {
            width: 100%;

            padding: 15px 18px;

            border: 2px solid #e5e7eb;

            border-radius: 12px;

            font-size: 18px;

            outline: none;

            transition:
                    border-color 0.3s,
                    box-shadow 0.3s,
                    transform 0.2s;
        }

        input:hover {
            border-color: #a5b4fc;
        }

        input:focus {
            border-color: #6366f1;

            box-shadow:
                    0 0 0 4px rgba(99, 102, 241, 0.15);

            transform: scale(1.02);
        }


        /* Add Button */

        button {
            width: 100%;

            margin-top: 8px;

            padding: 16px;

            border: none;

            border-radius: 12px;

            background: linear-gradient(
                    90deg,
                    #2196f3,
                    #7c3aed
            );

            color: white;

            font-size: 18px;

            font-weight: bold;

            cursor: pointer;

            box-shadow:
                    0 8px 20px rgba(99, 102, 241, 0.35);

            transition:
                    transform 0.2s,
                    box-shadow 0.2s;
        }

        button:hover {
            transform: translateY(-3px);

            box-shadow:
                    0 12px 25px rgba(99, 102, 241, 0.45);
        }

        button:active {
            transform: translateY(1px) scale(0.98);
        }


        /* Result */

        .result {
            margin-top: 30px;

            padding: 22px;

            border: 2px solid #22c55e;

            border-radius: 15px;

            background: #f0fdf4;

            text-align: center;

            animation: resultEntry 0.5s ease-out;
        }

        @keyframes resultEntry {

            from {
                opacity: 0;
                transform: scale(0.8);
            }

            70% {
                transform: scale(1.05);
            }

            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .result-title {
            color: #16a34a;

            font-size: 17px;

            font-weight: bold;

            margin-bottom: 12px;
        }

        .calculation {
            font-size: 30px;

            font-weight: bold;

            color: #1f2937;
        }

        .num1 {
            color: #2196f3;
        }

        .num2 {
            color: #7c3aed;
        }

        .answer {
            color: #16a34a;
        }


        /* Footer */

        .footer {
            text-align: center;

            margin-top: 25px;

            color: #6b7280;

            font-size: 14px;
        }

    </style>

</head>

<body>

<div class="calculator">

    <h1>➕ Add Two Numbers</h1>

    <p class="subtitle">
        Enter two numbers and calculate their sum
    </p>


    <form method="post"
          action="${pageContext.request.contextPath}/calculator">

        <div class="input-group">

            <label for="num1">
                Number 1
            </label>

            <input
                    id="num1"
                    type="number"
                    name="num1"
                    value="${num1}"
                    placeholder="Enter first number"
                    required
            />

        </div>


        <div class="input-group">

            <label for="num2">
                Number 2
            </label>

            <input
                    id="num2"
                    type="number"
                    name="num2"
                    value="${num2}"
                    placeholder="Enter second number"
                    required
            />

        </div>


        <button type="submit">
            🧮 Add
        </button>

    </form>


    <%
        if (request.getAttribute("result") != null) {
    %>

        <div class="result">

            <div class="result-title">
                ✓ Result
            </div>

            <div class="calculation">

                <span class="num1">${num1}</span>

                +

                <span class="num2">${num2}</span>

                =

                <span class="answer">${result}</span>

            </div>

        </div>

    <%
        }
    %>


    <div class="footer">
        Keep learning, keep calculating ❤️
    </div>

</div>

</body>

</html>