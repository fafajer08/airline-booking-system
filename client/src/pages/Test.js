import Navbar from "../components/NavBar";
import SearchFlightButton from "../components/Buttons";
import { ContinueButton, BackButton, SelectButton, SubmitButton } from "../components/Buttons";

export default function Test() {
    return (
      <div >
          <Navbar />
          <div className="d-flex justify-content-center flex-column align-items-center">
            <h1>Test Page</h1>
            <SearchFlightButton />
            <ContinueButton />
            <BackButton />
            <SelectButton />
            <SubmitButton />
          </div>
      </div>
    );
  }