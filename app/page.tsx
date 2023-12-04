import ImageCanvas from "../components/ImageCanvas";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>
        Title
      </h1>

      <ImageCanvas width={240} height={240}/>
      <div id="result" className="mt-3"></div>
    </main>
  )
}
