from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from LangGraph.state import State
from LangGraph.nodes import get_memory_node, get_chat_history_node, intent_classifier, planner
from LangGraph.nodes import get_inventory_node, image_data_node, pdf_data_node, generate_response
from LangGraph.nodes import add_chat_node, memory_write_node, formatter

graph_builder = StateGraph(State)


graph_builder.add_node("get_memory_node",get_memory_node)
graph_builder.add_node("get_chat_history_node",get_chat_history_node)
graph_builder.add_node("intent_classifier",intent_classifier)
graph_builder.add_node("planner",planner)

graph_builder.add_node("get_inventory_node",get_inventory_node)
graph_builder.add_node("image_data_node",image_data_node)
graph_builder.add_node("pdf_data_node",pdf_data_node)

graph_builder.add_node("generate_response",generate_response)

graph_builder.add_node("add_chat_node",add_chat_node)
graph_builder.add_node("memory_write_node",memory_write_node)
graph_builder.add_node("formatter",formatter)



graph_builder.add_edge(START,"get_memory_node")
graph_builder.add_edge("get_memory_node","get_chat_history_node")
graph_builder.add_edge("get_chat_history_node","intent_classifier")

graph_builder.add_edge("intent_classifier","planner")


def route(state:State):
    action = state["action"]

    if action == "get_image_data":
        return "image_data_node"
    
    elif action == "fetch_inventory":
        return "get_inventory_node"
    
    elif action == "get_pdf_data":
        return "pdf_data_node"
    
    else:
        return "generate_response"
    

graph_builder.add_conditional_edges("planner",route)

graph_builder.add_edge("image_data_node","generate_response")
graph_builder.add_edge("pdf_data_node","generate_response")
graph_builder.add_edge("get_inventory_node","generate_response")

graph_builder.add_node("memory_write_node","memory_write_node")
graph_builder.add_edge("memory_write_node","add_chat_node")
graph_builder.add_edge("add_chat_node","formatter")

graph_builder.add_edge("formatter",END)


checkpointer = MemorySaver()

graph = graph_builder.compile(checkpointer = checkpointer)















