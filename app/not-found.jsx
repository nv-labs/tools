import Link from 'next/link'

export default function NotFound() {
  return <div className="min-h-[200px] flex flex-col justify-center items-center text-center">
    <div>
      <h1 className="text-xl mb-4">404! - Not found </h1>
      <div>
        <Link href="/" className="underline">Go back to Home</Link>
      </div></div>
  </div>
}