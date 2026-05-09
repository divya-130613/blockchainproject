import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Verify() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/verifyBatch/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Batch Details</h2>
      <p><b>ID:</b> {data.id}</p>
      <p><b>Name:</b> {data.name}</p>
      <p><b>Manufacturer:</b> {data.manufacturer}</p>
      <p><b>Current Owner:</b> {data.currentOwner}</p>
      <p><b>Status:</b> {data.status}</p>
      <p><b>Timestamp:</b> {data.timestamp}</p>
    </div>
  );
}

export default Verify;