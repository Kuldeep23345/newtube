import Image from "next/image";


export default function VideoThumbnail() {
  return (
    <div className="relative">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Image src="/placeholder.svg" alt="Thumbnail" fill className="object-cover w-full h-full"/>
        </div>
    </div>
  )
}
