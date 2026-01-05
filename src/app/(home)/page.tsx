import Image from "next/image";

export default function page() {
  return (
    <div>
      <Image src="/logo.svg" alt="Logo" width={100} height={100} />
      <h1 className="text-3xl font-semibold tracking-tighter">newtube</h1>
    </div>
  );
}
