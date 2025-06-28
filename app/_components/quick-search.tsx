import Link from "next/link"
import Image from "next/image"
import { quickSearchOptions } from "../_constants/search"
import { Button } from "./ui/button"

const QuickSearch = () => {
  return (
    <div className="mt-4 flex gap-2 overflow-x-auto md:mt-4 md:justify-center lg:mt-6 lg:justify-center lg:gap-4 [&::-webkit-scrollbar]:hidden">
      {quickSearchOptions.map((option) => {
        return (
          // TODO Melhorar o componente
          <Button
            className="min-w-max gap-2"
            variant="secondary"
            key={option.title}
            asChild
          >
            <Link href={`/barbershops?service=${option.title}`}>
              <Image
                src={option.imageURL}
                width={16}
                height={16}
                alt={option.title}
              />
              <span className="text-xs lg:text-sm">{option.title}</span>
            </Link>
          </Button>
        )
      })}
    </div>
  )
}

export default QuickSearch
