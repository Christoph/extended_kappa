import pandas as pd
import re


def normalizeString(text):
    temp = re.sub(r"[^ a-zA-Z\\d\\s:]", " ", text).lower()
    return re.sub(r" +", " ", temp)


# Tool Data
def updateRow(series):
    temp = []
    for index, value in series.items():
        if index == "Keyword":
            temp.append(value)
        else:
            temp.append(normalizeString(value))
    return pd.Series(temp)


data = pd.read_csv("tool_results.csv")
data = data.drop(["Rec"], axis=1)
columns = data.columns

data = data.apply(updateRow, axis=1)
data.columns = columns

data.to_json("tool_results.json", orient="index")

# Manual Data


def updateRowManual(series):
    temp = []
    for index, value in series.items():
        if index == "Keyword":
            temp.append(value)
        else:
            if " " in value:
                temp.append(normalizeString(value))
            else:
                splitted = " ".join(re.findall('[a-zA-Z][^A-Z]*', value))
                temp.append(normalizeString(splitted))

    return pd.Series(temp)


man = pd.read_csv("manual_results.csv")
man = man.drop(["Rec", "Keyword_Processed"], axis=1)
columns = man.columns

man = man.apply(updateRowManual, axis=1)
man.columns = columns

man.to_json("manual_results.json", orient="index")

# Label Categories


def updateLabelRow(series):
    temp = []
    for index, value in series.items():
        if index == "Category":
            temp.append(value)
        else:
            temp.append(normalizeString(value))
    return pd.Series(temp)


labels = pd.read_csv("labels.csv")
labels = labels.dropna(axis=1)
columns = labels.columns

labels = labels.apply(updateLabelRow, axis=1)
labels.columns = columns

labels.to_json("labels.json", orient="index")
