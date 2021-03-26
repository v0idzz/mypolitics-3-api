export default `
    <style>
    html, body {
      width: 900px;
      height: 500px;
      margin: 0;
    }
    
    p {
        font-weight: 700;
        font-family: Poppins, sans-serif;
        color: #FFF;
        margin: 0;
        font-size: 1rem;
    }

    body {
        background: linear-gradient(105.28deg, #005669 0%, #004655 100%);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    </style>
    <p id="title">{{title}}</p>
    <script>
        title.style.transform = \`scale($\{(500 / title.getBoundingClientRect().width)})\`;
    </script>
`;
