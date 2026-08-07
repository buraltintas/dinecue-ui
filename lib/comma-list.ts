import { cleanList } from "@/lib/profile-preferences";

/**
 * Splits comma-separated entry without discarding a half-typed one. A trailing comma deliberately
 * produces an empty last entry: the blank is what lets the diner keep typing, and it is only dropped
 * when the value is persisted.
 */
export function parseCommaList(text: string) {
  return text.split(",").map((item) => item.trim());
}

/**
 * True when two lists mean the same thing once blanks are dropped. Used to tell an external change
 * (a save or a refetch) apart from the echo of the diner's own keystroke, which must not rewrite the
 * text they are still typing.
 */
export function sameCommaList(left: string[], right: string[]) {
  return cleanList(left).join(", ") === cleanList(right).join(", ");
}
