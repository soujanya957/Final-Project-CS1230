import ClientScene from "./components/ClientScene";

export default function Home() {
  return (
    <>
      <main
        style={{
          background: "white",
          height: "100vh",
          position: "relative",
          margin: 0,
        }}
      >
        <ClientScene />
      </main>
    </>
  );
}
