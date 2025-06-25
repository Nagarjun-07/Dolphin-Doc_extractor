# DocuDolphin

This is a Next.js starter project that allows you to upload documents, extract content, and ask questions about it using an AI-powered chatbot.

## Getting Started Locally

To get started, take a look at `src/app/page.tsx`.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

# 🐬 DocuDolphin – Document Intelligence, Redefined!

DocuDolphin is an AI-powered **document intelligence platform** built with **Next.js** that allows you to:

✅ Upload documents (PDFs)  
✅ Extract structured content (text, tables, formulas)  
✅ Chat with your document using a powerful **AI chatbot**  

Whether you're a researcher, student, lawyer, or analyst – DocuDolphin helps you understand your documents faster than ever.

---

## 🚀 Features

- 🧠 **AI Chatbot** – Ask questions directly from your document and get precise answers.
- 📄 **PDF Extraction** – Pull out text, tables, and formulas with a few clicks.
- ⚡ **Fast & Responsive UI** – Powered by Next.js for blazing-fast performance.
- ☁️ **Easy Vercel Deployment** – One-click deploy your own instance.
- 🔒 **Secure API Access** – Supports environment variables for private keys.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router)
- **AI Engine:** Google AI API
- **PDF Parsing:** Custom parser integrated into backend logic
- **Deployment:** Vercel

---

## 🧑‍💻 Getting Started Locally

Clone the repo:

```bash
git clone https://github.com/Nagarjun-07/Dolphin-Doc_extractor.git
cd Dolphin-Doc_extractor
```
## Deploying to Vercel

You can easily deploy this project to Vercel.

1.  **Sign up and Log In**: Create a Vercel account and log in.
2.  **Push to Git**: Make sure your project code is pushed to a Git repository (like GitHub, GitLab, or Bitbucket).
3.  **Import Project**:
    *   From your Vercel dashboard, click "Add New..." -> "Project".
    *   Connect your Git provider and select the repository for this project.
4.  **Configure Project**:
    *   Vercel will automatically detect that this is a Next.js project and configure the build settings correctly.
    *   You need to add your Google AI API key. Go to the project's **Settings** -> **Environment Variables**.
    *   Add a new variable:
        *   **Name**: `GOOGLE_API_KEY`
        *   **Value**: Paste your actual Google AI API key here.
5.  **Deploy**: Click the "Deploy" button. Vercel will build and deploy your project. Once it's done, you'll have a live URL for your DocuDolphin app!
