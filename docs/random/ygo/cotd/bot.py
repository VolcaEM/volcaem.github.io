# bot.py

import csv
import html
import os
import random
import re
from pathlib import Path

from telegram import Update
from telegram.constants import ParseMode
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    ContextTypes,
)

from cards import cards
from subtext import subtexts, specialSub

# global switch: True = use “numbers” list, False = use CSV
numbers_mode = True

# --- CSV setup ---
BASE_FOLDER = Path(__file__).parent.parent    # one folder up from this script
CSV_PATH    = BASE_FOLDER / "cards.csv"
csv_rows: list[list[str]] = []


def load_csv():
    """Carica tutte le righe da cards.csv (saltando l’intestazione)."""
    global csv_rows
    if not CSV_PATH.exists():
        print(f"[!] CSV non trovato: {CSV_PATH}")
        return
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="|")
        next(reader, None)  # skip header
        csv_rows = [row for row in reader if row]
    print(f"[+] CSV caricate: {len(csv_rows)} righe")


# --- rarity picker for numbers mode ---
RARITIES = [
    {"name": "Comune",       "weight": 0.60, "effect": None},
    {"name": "Ultra Rara",   "weight": 0.25, "effect": None},
    {"name": "Rara Ghost",   "weight": 0.05, "effect": None},
    {"name": "Rara Segreta", "weight": 0.10, "effect": None},
]


def weighted_random(choices):
    total = sum(c["weight"] for c in choices)
    pick = random.random() * total
    for c in choices:
        if pick < c["weight"]:
            return c
        pick -= c["weight"]
    return choices[0]


# --- /draw handler ---
async def draw_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if numbers_mode:
        # ---- numbers mode ----
        card = random.choice(cards)
        rarity = weighted_random(RARITIES)

        raw   = card.name.split(":")[0].replace("Numero ", "")
        clean = re.sub(r"^[iCSF]+", "", raw)

        if clean == "XX":
            sub = specialSub.get("XX", "???")
        elif clean.isdigit() and int(clean) == 1000:
            sub = specialSub.get("1000", "???")
        elif clean.isdigit():
            idx = int(clean)
            sub = subtexts[idx] if 0 <= idx < len(subtexts) else "???"
        else:
            sub = "???"

        safe_name   = html.escape(card.name)
        safe_rarity = html.escape(rarity["name"])
        safe_sub    = html.escape(sub)

        caption = (
            f"<b>{safe_name}</b> 🎉\n"
            f"Rarità: {safe_rarity}\n\n"
            f"<i>{safe_sub}</i>"
        )
        await update.message.reply_photo(
            photo=card.image,
            caption=caption,
            parse_mode=ParseMode.HTML
        )

    else:
        # ---- CSV mode ----
        if not csv_rows:
            return await update.message.reply_text("Nessuna carta CSV caricata.")

        row  = random.choice(csv_rows)
        name = row[0]

        img_field = next((f for f in row if f.lower().endswith(".png")), None)
        if not img_field:
            return await update.message.reply_text(f"{name} → immagine non trovata.")

        img_path = BASE_FOLDER / img_field
        if not img_path.exists():
            return await update.message.reply_text(f"{name} → file mancante: {img_path}")

        safe_name = html.escape(name)
        caption   = f"<b>{safe_name}</b>"

        await update.message.reply_photo(
            photo=str(img_path),
            caption=caption,
            parse_mode=ParseMode.HTML
        )


# --- /mode handler ---
async def mode_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    global numbers_mode
    args = context.args
    if not args or args[0].lower() not in ("on", "off"):
        state = "ON" if numbers_mode else "OFF"
        return await update.message.reply_text(
            f"Modo NUMERI è: {state}. Usa /mode on|off per cambiare."
        )

    numbers_mode = (args[0].lower() == "on")
    state = "ON" if numbers_mode else "OFF"
    await update.message.reply_text(f"Modo NUMERI impostato: {state}.")


# --- /find handler ---
async def find_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = " ".join(context.args).strip().lower()
    if not query:
        return await update.message.reply_text("Usage: /find <card name or ID>")

    tokens = re.findall(r"\w+", query)

    matches = []

    # search numbers-mode cards
    for card in cards:
        text = card.name.lower().replace(":", " ")
        if all(tok in text for tok in tokens):
            matches.append(("numbers", card))

    # search CSV rows
    for row in csv_rows:
        name = row[0].lower()
        card_id = row[8].lower() if len(row) > 8 else ""
        if query == card_id or all(tok in name for tok in tokens):
            matches.append(("csv", row))

    if not matches:
        return await update.message.reply_text("Nessuna corrispondenza trovata.")

    # log all matches for the developer
    dev_list = []
    for kind, item in matches:
        if kind == "numbers":
            dev_list.append(item.name)
        else:
            dev_list.append(item[0])
    print(f"[DEV] /find “{query}” → matches: {dev_list}")

    # show only the first match to the user
    kind, item = matches[0]
    if kind == "numbers":
        card = item
        safe_name = html.escape(card.name)
        await update.message.reply_photo(
            photo=card.image,
            caption=f"<b>{safe_name}</b>",
            parse_mode=ParseMode.HTML
        )
    else:
        row = item
        name = row[0]
        img_field = next((f for f in row if f.lower().endswith(".png")), None)
        img_path = BASE_FOLDER / img_field if img_field else None

        safe_name = html.escape(name)
        if img_path and img_path.exists():
            await update.message.reply_photo(
                photo=str(img_path),
                caption=f"<b>{safe_name}</b>",
                parse_mode=ParseMode.HTML
            )
        else:
            await update.message.reply_text(f"{name} (immagine non disponibile)")



# --- entrypoint ---
def main():
    print("[*] Caricamento CSV…")
    load_csv()

    app = ApplicationBuilder().token("YOUR_TOKEN_HERE").build()
    app.add_handler(CommandHandler("draw", draw_command))
    app.add_handler(CommandHandler("mode", mode_command))
    app.add_handler(CommandHandler("find", find_command))

    print("[*] Bot avviato. In ascolto…")
    app.run_polling()


if __name__ == "__main__":
    main()
