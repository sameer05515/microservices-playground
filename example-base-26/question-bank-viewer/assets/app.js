function questionBank() {

    return {

        /* =====================================================
           STATE
           ===================================================== */

        questions: [],

        tags: [],

        search: "",

        selectedTag: null,

        selectedQuestion: null,

        darkMode: false,

        showToast: false,


        /* =====================================================
           INIT
           ===================================================== */

        async init() {

            this.loadTheme();

            await this.loadData();

            this.initHashRouting();

            /*
             * Browser Back / Forward
             */
            window.addEventListener(
                "hashchange",
                () => {
                    this.handleHashChange();
                }
            );
        },


        /* =====================================================
           LOAD JSON
           ===================================================== */

        async loadData() {

            try {

                const response =
                    await fetch(
                        "./question-bank.json"
                    );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load question-bank.json"
                    );
                }

                const data =
                    await response.json();

                this.questions =
                    data.questions || [];

                this.tags =
                    data.tags || [];

            } catch (error) {

                console.error(
                    "Failed to load data:",
                    error
                );

                alert(
                    "Unable to load question-bank.json"
                );
            }
        },


        /* =====================================================
           HASH ROUTING
           
           Supported URLs:
           
           #/
           #/questions
           #/question/{id}
           
           ===================================================== */

        initHashRouting() {

            this.handleHashChange();
        },


        handleHashChange() {

            const hash =
                window.location.hash;


            /*
             * No hash
             *
             * #
             * ""
             */
            if (
                !hash ||
                hash === "#"
            ) {

                this.selectFirstQuestion();

                return;
            }


            /*
             * Remove #
             */
            let route =
                hash.substring(1);


            /*
             * Remove leading /
             */
            route =
                route.replace(
                    /^\/+/,
                    ""
                );


            /*
             * Home / Questions
             */
            if (
                route === "" ||
                route === "questions"
            ) {

                this.selectFirstQuestion();

                return;
            }


            /*
             * Question route
             *
             * #/question/68c123
             */
            if (
                route.startsWith(
                    "question/"
                )
            ) {

                const questionId =
                    decodeURIComponent(
                        route.substring(
                            "question/".length
                        )
                    );


                this.selectQuestionById(
                    questionId
                );

                return;
            }


            /*
             * Unknown route
             */
            this.selectedQuestion =
                null;
        },


        /* =====================================================
           SELECT FIRST QUESTION
           ===================================================== */

        selectFirstQuestion() {

            if (
                this.questions &&
                this.questions.length > 0
            ) {

                this.selectedQuestion =
                    this.questions[0];

            } else {

                this.selectedQuestion =
                    null;
            }
        },


        /* =====================================================
           SELECT QUESTION BY ID
           ===================================================== */

        selectQuestionById(id) {

            const question =
                this.questions.find(
                    item =>
                        String(item.id) ===
                        String(id)
                );


            if (!question) {

                console.warn(
                    "Question not found:",
                    id
                );

                this.selectedQuestion =
                    null;

                return;
            }


            this.selectedQuestion =
                question;


            /*
             * If current search/tag filter
             * hides this question,
             * clear filters.
             */
            const isVisible =
                this.filteredQuestions.some(
                    item =>
                        item.id ===
                        question.id
                );


            if (!isVisible) {

                this.search = "";

                this.selectedTag =
                    null;
            }


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },


        /* =====================================================
           SELECT QUESTION
           ===================================================== */

        selectQuestion(question) {

            if (!question) {
                return;
            }


            this.selectedQuestion =
                question;


            /*
             * Create URL:
             *
             * #/question/{id}
             */
            const newHash =
                "#/question/" +
                encodeURIComponent(
                    question.id
                );


            /*
             * Update URL only if necessary.
             */
            if (
                window.location.hash !==
                newHash
            ) {

                window.location.hash =
                    newHash;
            }


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },


        /* =====================================================
           FILTERED QUESTIONS
           ===================================================== */

        get filteredQuestions() {

            let result =
                this.questions || [];


            /*
             * TAG FILTER
             */
            if (this.selectedTag) {

                result =
                    result.filter(
                        question =>
                            (
                                question.tags ||
                                []
                            ).includes(
                                this.selectedTag
                            )
                    );
            }


            /*
             * SEARCH
             */
            const search =
                this.search
                    .trim()
                    .toLowerCase();


            if (search) {

                result =
                    result.filter(
                        question => {

                            const questionText =
                                question.question ||
                                "";


                            const answers =
                                (
                                    question.answers ||
                                    []
                                ).join(" ");


                            const tagNames =
                                (
                                    question.tags ||
                                    []
                                )
                                    .map(
                                        tagId =>
                                            this.tagName(
                                                tagId
                                            )
                                    )
                                    .join(" ");


                            const content =
                                (
                                    questionText +
                                    " " +
                                    answers +
                                    " " +
                                    tagNames
                                )
                                    .toLowerCase();


                            return content.includes(
                                search
                            );
                        }
                    );
            }


            return result;
        },


        /* =====================================================
           TAG
           ===================================================== */

        selectTag(tagId) {

            this.selectedTag =
                tagId;


            const first =
                this.filteredQuestions[0];


            if (first) {

                this.selectQuestion(
                    first
                );
            }
        },


        clearTag() {

            this.selectedTag =
                null;
        },


        tagName(tagId) {

            const tag =
                this.tags.find(
                    tag =>
                        tag.id === tagId
                );


            return tag
                ? tag.name
                : tagId;
        },


        /* =====================================================
           PLAIN TEXT
           ===================================================== */

        plainText(markdown) {

            if (!markdown) {
                return "";
            }


            const div =
                document.createElement(
                    "div"
                );


            div.innerHTML =
                marked.parse(
                    markdown
                );


            return (
                div.textContent ||
                div.innerText ||
                ""
            )
                .replace(
                    /\s+/g,
                    " "
                )
                .trim();
        },


        /* =====================================================
           MARKDOWN
           ===================================================== */

        renderMarkdown(markdown) {

            if (!markdown) {
                return "";
            }


            const html =
                marked.parse(
                    markdown,
                    {
                        gfm: true,
                        breaks: true
                    }
                );


            return DOMPurify.sanitize(
                html
            );
        },


        /* =====================================================
           PREVIOUS / NEXT
           ===================================================== */

        getCurrentQuestionIndex() {

            if (!this.selectedQuestion) {
                return -1;
            }


            return this.questions.findIndex(
                question =>
                    question.id ===
                    this.selectedQuestion.id
            );
        },


        hasPreviousQuestion() {

            const index =
                this.getCurrentQuestionIndex();


            return index > 0;
        },


        hasNextQuestion() {

            const index =
                this.getCurrentQuestionIndex();


            return (
                index >= 0 &&
                index <
                    this.questions.length - 1
            );
        },


        previousQuestion() {

            const index =
                this.getCurrentQuestionIndex();


            if (index <= 0) {
                return;
            }


            const previous =
                this.questions[
                    index - 1
                ];


            this.selectQuestion(
                previous
            );
        },


        nextQuestion() {

            const index =
                this.getCurrentQuestionIndex();


            if (
                index < 0 ||
                index >=
                    this.questions.length - 1
            ) {
                return;
            }


            const next =
                this.questions[
                    index + 1
                ];


            this.selectQuestion(
                next
            );
        },


        /* =====================================================
           COPY QUESTION URL
           ===================================================== */

        async copyQuestionUrl() {

            if (!this.selectedQuestion) {
                return;
            }


            const url =
                window.location.href;


            try {

                await navigator.clipboard
                    .writeText(url);


                this.showToast =
                    true;


                setTimeout(() => {

                    this.showToast =
                        false;

                }, 2000);


            } catch (error) {

                console.error(
                    "Failed to copy URL:",
                    error
                );


                /*
                 * Fallback
                 */
                try {

                    const textarea =
                        document.createElement(
                            "textarea"
                        );

                    textarea.value =
                        url;

                    textarea.style.position =
                        "fixed";

                    textarea.style.opacity =
                        "0";

                    document.body.appendChild(
                        textarea
                    );

                    textarea.select();

                    document.execCommand(
                        "copy"
                    );

                    textarea.remove();


                    this.showToast =
                        true;


                    setTimeout(() => {

                        this.showToast =
                            false;

                    }, 2000);

                } catch (fallbackError) {

                    console.error(
                        "Copy fallback failed:",
                        fallbackError
                    );
                }
            }
        },


        /* =====================================================
           THEME
           ===================================================== */

        loadTheme() {

            const saved =
                localStorage.getItem(
                    "question-bank-theme"
                );


            if (saved) {

                this.darkMode =
                    saved === "dark";

            } else {

                this.darkMode =
                    window.matchMedia(
                        "(prefers-color-scheme: dark)"
                    ).matches;
            }


            this.applyTheme();
        },


        toggleTheme() {

            this.darkMode =
                !this.darkMode;


            localStorage.setItem(
                "question-bank-theme",
                this.darkMode
                    ? "dark"
                    : "light"
            );


            this.applyTheme();
        },


        applyTheme() {

            document.documentElement
                .classList
                .toggle(
                    "dark",
                    this.darkMode
                );
        }

    };
}