import { useState} from 'react'
import { FormularioDiscos } from './components/Formulario'
import { DiscosLista } from './components/Lista'

function App() {
  
    //guardamos el estado del disco que queremos editar
    const [discoAEditar, setDiscoAEditar] = useState(null);

    return (
            <main>

                {/* le pasamos al formulario el elemento a editar */}
                {/* este formulario se colocará a la IZQ */}
                <FormularioDiscos
                    discoAEditar={discoAEditar}
                    onTerminarEdicion={() => setDiscoAEditar(null)}
                />

                {/* le pasa a la lista de discos también la edición del disco */}
                {/* la lista de discos y álbumnes se colocará a la DCHA */}
                <DiscosLista onEditar={(disco) => setDiscoAEditar(disco)} />

            </main>
    );

}

export default App
