import Axios from "axios";

const axios = Axios.create({
  baseURL: "https://aium.cc/v1",
  headers: {
    Authorization: "Bearer sk-PICS7z4404Txw5ec9792B70d40C64f1d969d900690Cd549a",
  },
});
// const axios = Axios.create({
//   baseURL: "https://oa.api2d.net/v1",
//   headers: {
//     Authorization: "Bearer fk224348-jkg8FJUdtV8fgokqi44PqFV6lHWIsaHW",
//   },
// });

export default axios;
