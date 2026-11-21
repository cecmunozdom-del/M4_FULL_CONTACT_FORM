import { useState} from 'react'
import { FormularioDiscos } from './components/Formulario'
import { DiscosLista } from './components/Lista'

function App() {
  
    //guardamos el estado del disco que queremos editar
    const [discoAEditar, setDiscoAEditar] = useState(null);

    return (
            <main>

                {/* le pasamos al formulario el elemento a editar */}
                <FormularioDiscos
                    discoAEditar={discoAEditar}
                    onTerminarEdicion={() => setDiscoAEditar(null)}
                />

                {/* le pasamos al formulario el elemento a editar */}
                <DiscosLista onEditar={(disco) => setDiscoAEditar(disco)} />

            </main>
    );

}

export default App
