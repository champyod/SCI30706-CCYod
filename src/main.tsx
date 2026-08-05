import { createRoot } from "react-dom/client";

const root = document.getElementById("root");
if (!root) throw new Error("missing #root element");

createRoot(root).render(<h1>FinGoal</h1>);
