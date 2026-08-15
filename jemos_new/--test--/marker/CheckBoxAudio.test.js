import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CheckBoxAudio from "../../src/components/screens/marker/CheckBoxAudio";

describe("CheckBoxAudio", () => {
  test("call updateCheckAudio", () => {
    const updateCheckAudio = jest.fn();
    const { getByLabelText } = render(
      <CheckBoxAudio
        markerCheckAudio={true}
        updateCheckAudio={updateCheckAudio}
      />
    );

    const checkbox = getByLabelText("Audio");
    fireEvent.click(checkbox);

    expect(updateCheckAudio).toHaveBeenCalledTimes(1);
  });

  test("render checkbox as checked when markerCheckAudio is true", () => {
    const { getByLabelText } = render(
      <CheckBoxAudio markerCheckAudio={true} updateCheckAudio={() => {}} />
    );

    const checkbox = getByLabelText("Audio");
    expect(checkbox.checked).toBe(true);
  });

  test("render checkbox as unchecked when markerCheckAudio is false", () => {
    const { getByLabelText } = render(
      <CheckBoxAudio markerCheckAudio={false} updateCheckAudio={() => {}} />
    );

    const checkbox = getByLabelText("Audio");
    expect(checkbox.checked).toBe(false);
  });
});
