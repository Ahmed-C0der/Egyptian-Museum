import { El_Messiri } from "next/font/google";
export const metadata = {
  title: "Egyptian Museum",
  description: "A museum showcasing ancient Egyptian artifacts"
};


const elMessiri = El_Messiri({
    subsets: ["arabic"],
    weight: ["400", "700"],
    variable: "--font-el-messiri",
});
export default function Layout({ children }) {
  return (
    <html className={elMessiri.variable}>
        <body>{children}</body>
    </html>
  );
}
