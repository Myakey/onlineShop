import axios from "axios";

const apiKey = import.meta.env.RAJAONGKIR_API_KEY_COST;

axios.get("https://rajaongkir.komerce.id/api/v1/destination/province", {
  headers: { key: apiKey },
})
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));

  