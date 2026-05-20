// App コンポーネントは router だけを返す薄いラッパーにしています。
import { AppRouter } from "@/app/router";

function App() {
  return <AppRouter />;
}

export default App;