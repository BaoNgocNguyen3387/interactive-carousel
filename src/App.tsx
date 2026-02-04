import { SlideContainer } from "./components";
import { fakeData } from "./components/slider/constants/mockup";
import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <main>
        <SlideContainer slideList={fakeData} />
      </main>
    </div>
  );
}

export default App;
