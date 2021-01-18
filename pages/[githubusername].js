import axios from "axios";
import { SocialIcon } from "react-social-icons";
import Image from "next/image";
import { useRouter } from "next/router";

const styleConsts = ["background", "color"];

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  let { githubusername } = params;

  let data;
  try {
    data = await axios
      .get(
        `https://raw.githubusercontent.com/${githubusername}/${githubusername}/main/README.md`
      )
      .then((res) => res.data);
  } catch (err) {
    console.log("trying with master");
  }
  if (!data) {
    try {
      data = await axios
        .get(
          `https://raw.githubusercontent.com/${githubusername}/${githubusername}/master/README.md`
        )
        .then((res) => {
          return res.data;
        });
    } catch (err) {
      console.log("no hireable data");
    }
  }

  let hireable = data?.split("h1r4bl3")?.[1];

  let github = await axios
    .get(`https://api.github.com/users/${githubusername}`)
    .then((res) => res.data);

  let all = [{ key: "github", value: github.html_url }];

  let style = { background: "white", color: "black" };
  if (!!hireable) {
    let lines = hireable.split("\n");

    lines.forEach((l) => {
      let [key, value] = l.split(" ._. ");
      if (!key || !value) return;
      if (styleConsts.includes(key)) {
        style[key] = value;
      } else all.push({ key, value });
    });
  }

  return {
    props: { style, all, github },
    revalidate: 1,
  };
}

export default function Home({ github, all, style }) {
  let router = useRouter();
  if (router.isFallback) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        Generating...
      </div>
    );
  }
  return (
    <div
      style={{
        ...style,
        height: "100vh",
        display: "grid",
        placeItems: "center",
        width: "100vw",
        textAlign: "center",
      }}
    >
      <h1>@{github?.login}</h1>
      <p>{github?.bio}</p>

      <Image src={github?.avatar_url} width="460" height="460" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          width: "80%",
          padding: "2%",
        }}
      >
        {all?.map((a) => (
          <SocialIcon
            fgColor="white"
            url={a.value}
            label={`${a.key} icon link of ${github.login}`}
            network={a.key}
          />
        ))}
      </div>
    </div>
  );
}
