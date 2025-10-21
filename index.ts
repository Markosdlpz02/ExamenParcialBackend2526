import express from "express";
import cors from "cors";
import axios from "axios"
import { setTimeout } from "timers";

type LD = {
    id: number,
    filmName: string,
    rotationType: "CAV" | "CLV",
    region: string,
    lengthMinutes: number,
    videoFormat: "NTSC" | "PAL"
}

let discos: LD[] = [

 { id: 1, filmName: "Fast and Furious", rotationType: "CAV", region: "California", lengthMinutes: 200, videoFormat: "NTSC" },

 { id: 2, filmName: "Harry Potter", rotationType: "CLV", region: "San Francisco", lengthMinutes: 120, videoFormat: "PAL" },

];

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Te has conectado correctamente.");
});

app.get("/ld", (req, res) => {
  res.json(discos);
});

app.get("/ld/:id", (req, res) => {
  const {id} = req.params;
  const disco = discos.find((disco) => disco.id === Number(id));

  return disco
    ? res.json(disco)
    : res.status(404).json({ error: "Disco no encontrado" });
});

app.post("/ld", (req, res) => {

  try {

    const newDisco: LD = {
      id: Date.now(),
      ...req.body,
    };

    discos.push(newDisco);
    res.status(201).json(newDisco);
  } catch (err: any) {

    res.status(500).json({ error: "Error al crear el disco", detail: err.message });
  }
});

app.delete("/ld/:id", (req, res) => {
  try {
    const { id } = req.params;
    const exists = discos.some((p) => p.id === Number(id));

    if (!exists)
      return res.status(404).json({ error: "Disco no encontrado" });

    discos = discos.filter((p) => p.id !== Number(id));

    res.json({ message: "Disco eliminado correctamente" });

  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el disco"});
  }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));


const testApi = async (discos:LD[]) => {

    
    const todoslosDiscos = await (await axios.get("http://localhost:3000/ld")).data;
    console.log("\nTODOS LOS DISCOS" + "\n")
    console.log(todoslosDiscos)

    const crearDisco = await axios.post("http://localhost:3000/ld", {filmName: "El contable", rotationType: "CLV", region: "Madrid", lengthMinutes: 150, videoFormat: "NTSC" });

    
    const DiscosActualizados = await (await axios.get("http://localhost:3000/ld")).data;

    const disco: LD = DiscosActualizados.find((disco:LD) => disco.filmName === "El contable");
    const id = disco.id
    console.log("\nDISCOS ACTUALIZADOS CON EL NUEVO DISCO" + "\n")
    console.log(DiscosActualizados)

    const eliminarDisco = await axios.delete(`http://localhost:3000/ld/${id}`);

    const ListaFinalDiscos = await (await axios.get("http://localhost:3000/ld")).data;
    console.log("\nLISTA FINAL DE DISCOS BORRANDO EL NUEVO DISCO " + "\n")
    console.log(ListaFinalDiscos)
};


setTimeout(async () => {
  await testApi(discos);
}, 1000);
