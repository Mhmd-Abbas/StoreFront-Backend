import express, { Request, Response } from 'express'
import cors from 'cors'
import UsersRoutes from "./handlers/UsersHandler"
import CategoriesRoutes from "./handlers/CategoriesHandler" 
import OrdersRoutes from "./handlers/OrdersHandler"
import ProductsRoutes from "./handlers/ProductsHandler"


const app: express.Application = express()
const address: string = "http://localhost:3000"

const corsOptions = {
    origin: address,
    optionSuccessStatus:200
}

app.use(cors(corsOptions))
app.use(express.json())

app.get('/', function (_req: Request, res: Response) {
    res.send('Hello World!')
})

UsersRoutes(app)
CategoriesRoutes(app)
OrdersRoutes(app)
ProductsRoutes(app)


app.get('/test-cors', cors(corsOptions), function (_req: Request, res: Response, next) {
    res.send('This is CORS-Enabled with a middle ware')
})

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})


export default app;