import './style.css'
import { useState} from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { FormularioDiscos } from './components/Formulario'
import { DiscosLista } from './components/Lista'

const queryClient = new QueryClient();

function App() {
  
    //guardamos el estado del disco que queremos editar
    const [discoAEditar, setDiscoAEditar] = useState(null);

    return (
        <QueryClientProvider client={queryClient}>
            <main>

                {/* le pasamos al formulario el elemento a editar */}
                <FormularioDiscos
                    discoAEditar={discoAEditar}
                    onTerminarEdicion={() => setDiscoAEditar(null)}
                />

                {/* le pasamos al formulario el elemento a editar */}
                <DiscosLista onEditar={(disco) => setDiscoAEditar(disco)} />

            </main>
        </QueryClientProvider>

    );

}

export default App
