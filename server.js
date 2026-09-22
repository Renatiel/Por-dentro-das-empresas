const app = require("./app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Por dentro das empresas API rodando em http://localhost:${PORT}`);
});
