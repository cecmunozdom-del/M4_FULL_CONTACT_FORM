import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.jsx'

//instancia central de TanStackQuery
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(

  //se envuelve en QueryClientProvider para que los componentes hijos se conecten a la misma caché
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools />
  </QueryClientProvider>

)
