import React, { useState, useEffect, useRef } from "react";

const Sidebar = ({
  jsonData = [],
  onItemSelect = () => { },
  selectedConv: selItem = null,
  onItemSelectionChange = () => { },
  onHideClick = () => { },
  customSideBarStyle={}
}) => {
  const [conversationNames, setConversationNames] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const myRef = useRef(null);

  useEffect(() => {
    // Extract conversation names from jsonData and set them in state
    const names = jsonData.map((conversation) => ({
      title: conversation.title,
      id: conversation.id,
    }));
    setConversationNames(names);
  }, [jsonData]);

  useEffect(() => {
    //console.log(`Selected item : ${JSON.stringify(selItem)}`);
    setSelectedConv(selItem);
    
  }, [selItem])

  useEffect(()=>{
    if(selectedConv && selectedConv.id!=null){
      // myRef.current?.scrollIntoView({
      //   behavior: "smooth",
      //   block: "nearest",
      //   inline: "start",
      // });
      window.scrollTo({
        top: myRef.current.offsetTop,
        behavior: "smooth"
      })
    }

  },[selectedConv])

  const handleLinkSelection = (selectedItem) => {
    console.log(JSON.stringify(selectedItem));
    // setSelectedLink(selectedItem);
    // navigate(`${selectedItem.topicId}`);
    setSelectedConv(selectedItem);
    onItemSelect(selectedItem);
  };

  return (
    <div
      style={{ width: "200px", backgroundColor: "#f0f0f0", padding: "20px", ...customSideBarStyle }}
    >
      <button onClick={onHideClick}>Hide</button>
      <h2>Conversation Names</h2>
      <ul>
        {conversationNames.map((conv) => (
          <li key={conv.id}>
            <span
              ref={selectedConv && selectedConv.id!=null ? myRef : null}
              style={
                selectedConv && selectedConv.id === conv.id
                  ? styles.selected
                  : {}
              }
              onClick={() => handleLinkSelection(conv)}
            >
              {conv.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  selected: {
    fontWeight: "bold" /* Make selected link text bold */,
    fontSize: "22px" /* Increase font size for selected link */,
    color: "#e91140",
  },
};


export default Sidebar;
