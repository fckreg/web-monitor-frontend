// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Field, FormError } from "./field";
import { Input } from "./input";

afterEach(cleanup);

describe("Field", () => {
  it("связывает подпись, подсказку и ошибку с полем", () => {
    render(
      <Field label="Адрес" hint="Например, https://example.org" error="Неверный адрес">
        {(control) => <Input {...control} />}
      </Field>,
    );

    const input = screen.getByLabelText("Адрес");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const describedBy = input.getAttribute("aria-describedby")?.split(" ") ?? [];
    const texts = describedBy.map((id) => document.getElementById(id)?.textContent);
    expect(texts).toEqual(["Например, https://example.org", "Неверный адрес"]);
  });

  it("без ошибки не помечает поле невалидным", () => {
    render(<Field label="Имя">{(control) => <Input {...control} />}</Field>);

    const input = screen.getByLabelText("Имя");
    expect(input.hasAttribute("aria-invalid")).toBe(false);
    expect(input.hasAttribute("aria-describedby")).toBe(false);
  });
});

describe("FormError", () => {
  it("объявляет ошибку формы через role=alert", () => {
    render(<FormError>Сервер недоступен</FormError>);
    expect(screen.getByRole("alert").textContent).toBe("Сервер недоступен");
  });

  it("ничего не выводит без текста", () => {
    const { container } = render(<FormError>{null}</FormError>);
    expect(container.innerHTML).toBe("");
  });
});
