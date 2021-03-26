import React, {useState,useEffect} from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    margin:0,
    padding:0,
    backgroundColor: theme.palette.background.default,
    
  },
}));



const App = () =>{
  const[fileList,setFileList] = useState({});
  const[openTabText,setOpenTabText] = useState('');
  const classes = useStyles();
  
  async function fetchFolder(){
    const response = await axios.get(`http://localhost:5000/folderManager`);
    setFileList(response.data);
  }

  async function fetchFile(absolutePath){
    const message = `http://localhost:5000/fileManager?absolutePath=`+absolutePath;
    const response = await axios.get(message);
    setOpenTabText(response.data);
  }

  useEffect(()=>{
    fetchFolder();
  },[]);

  function getTreeItemsFromData(treeItems){
    if(treeItems['name']===undefined)
      return;
    let children = undefined;
    children = treeItems['children'].map(getTreeItemsFromData);
    return (
        <TreeItem
          key={treeItems.absolutePath}
          nodeId={treeItems.absolutePath}
          label={treeItems.name}
          children={children}
          onClick={treeItems.itemType==='file'?() => {fetchFile(treeItems.absolutePath);}:null}
        />
      );
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      
      <Drawer className={classes.drawer} variant="permanent" classes={{paper: classes.drawerPaper,}} anchor="left">
        <TreeView defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
          {getTreeItemsFromData(fileList)}
        </TreeView>
      </Drawer>

      <main className={classes.content}>        
        <AceEditor
          mode="python"
          theme="monokai"
          fontSize={14}
          highlightActiveLine={true}
          value={openTabText}
          style={{width:'100%'}}
          setOptions={{
            showLineNumbers: true,
            tabSize: 2,
          }}/>
      </main>
    </div>
  );
}

export default App;


