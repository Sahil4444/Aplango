import Hero from "../Hero/Hero";
import Clients from "../../Clients/Clients";
import Banner from "../Hero/Banner";

function Front() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Clients />
      {/* <Banner /> */}
    </div>
  );
}

export default Front;
