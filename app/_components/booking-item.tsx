import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

// TODO receber agendamento como prop
const BookingItem = () => {
  return (
    <>
      <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
        Agendamentos
      </h2>
      <Card>
        <CardContent className="flex justify-between p-0">
          {/* ESQUERDA */}
          <div className="flex flex-col gap-2 py-5 pl-5">
            <Badge className="w-fit">Confirmado</Badge>
            <h3 className="font-semibold">Corte de Cabelo</h3>

            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://www.bing.com/th?id=OIP.ggVEFA2uuXv0uRKdNjdVCwHaHa&w=112&h=106&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2" />
              </Avatar>
              <p className="text-sm">Barbearia LG</p>
            </div>
          </div>
          {/* DIREITA */}
          <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
            <p className="text-sm">Agosto</p>
            <p className="text-2xl">10</p>
            <p className="text-sm">10:00</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default BookingItem
