from rich.console import Console
from rich.layout import Layout
from rich.panel import Panel

layout = Layout()
layout.split_row(
    Layout(name="left"),
    Layout(name="right"),
)
# print(layout)

layout["left"].update(
    Panel("The mystery of life isn't a problem to solve, but a reality to experience.")
    
)
console1 = Console()
console2 = Console()
console1.print(layout['left'])
console2.print(layout['right'])