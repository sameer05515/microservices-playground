// import React from "react";
import { useSearchParams } from "react-router-dom";
import HomeV1 from "./v1";
import HomeV2 from "./v2";
import { Link } from "react-router-dom";

const Home = () => {
  const [searchParams] = useSearchParams();
  const version = searchParams.get("version") || "v2";
  return (
    <div>
      <div>
        <Link to={`/?version=v1`}>HomeV1 </Link> | <Link to={`/?version=v2`}>HomeV2 </Link>
      </div>
      {version === "v1" && <HomeV1 />}
      {version === "v2" && <HomeV2 />}
    </div>
  );
};

export default Home;
