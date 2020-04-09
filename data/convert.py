import pandas as pd
import re


def normalizeString(text):
    temp = re.sub(r"[^ a-zA-Z\\d\\s:]", " ", text).lower()
    return re.sub(r" +", " ", temp)


def updateRow(series):
    temp = []
    for index, value in series.items():
        if index == "Keyword":
            temp.append(value)
        else:
            temp.append(normalizeString(value))
    return pd.Series(temp)


def updateRowManual(series):
    temp = []
    for index, value in series.items():
        if index == "Keyword":
            temp.append(value)
        elif index == "Mike":
            temp.append(normalizeString(
                " ".join(re.findall('[a-zA-Z][^A-Z]*', value))))
        else:
            temp.append(normalizeString(value))
    return pd.Series(temp)


data = pd.read_csv("tool_results.csv")
data = data.drop(["Rec", "MichaelRecPosition", "MikeRecPosition",
                  "TorstenRecPosition"], axis=1)
columns = data.columns

data = data.apply(updateRow, axis=1)
data.columns = columns

data.to_json("tool_results.json", orient="index")

man = pd.read_csv("manual_results.csv")
man = man.drop(["Rec", "Keyword_Processed"], axis=1)
columns = man.columns

man = man.apply(updateRowManual, axis=1)
man.columns = columns

man.to_json("manual_results.json", orient="index")
