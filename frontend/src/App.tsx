import React, { useEffect, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { SelectButton } from "primereact/selectbutton";
import { deleteSongs, getSongs, insertSongs } from "./service/music";

export type TSong = {
  id: string,
  title: string,
  from: Array<string>
}

export type TSongCreate = {
  title: string,
  to: Number
}

export type TSongRemove = {
  id: string,
  from: Number
}

function App() {
  const [songs, setSongs] = useState<TSong[]>([]);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [removeDialogVisible, setRemoveDialogVisible] = useState(false);
  const [newSong, setNewSong] = useState<TSongCreate>({ title: "", to: 1 });
  const [value, setValue] = useState<string[]>([]);
  const [removeValue, setRemoveValue] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<TSong | null>(null);

  const songsRequest = async () => {
    try{
      const data = await getSongs();
      setSongs(data);
    }catch(err){
      console.log(err)
    }
  }


  useEffect( () => {songsRequest();}, []);

  const items = [
    { name: 'Database 1', value: 1 },
    { name: 'Database 2', value: 2 }
  ];

  const removeOptions = (from: string[]) => {
    let options = [];
    if (from.includes('db1')) options.push({ name: 'Database 1', value: 1 });
    if (from.includes('db2')) options.push({ name: 'Database 2', value: 2 });
    if (from.length === 2) options.push({ name: 'All', value: 3 });
    return options;
  };

  const handleAddSong = async () => {
    
    try{
      const data = await insertSongs(newSong);
      
      setSongs([...songs, data])
      
      setNewSong({ title: "", to: 1 });
      setDialogVisible(false);

    }catch(err){
      console.log(err);
    }

  };

  const handleRemoveSong = async () => {

    try{
      if(selectedSong){
        const data = await deleteSongs({id: selectedSong?.id, from: Number(removeValue)});
        if(data) songsRequest();
      }

      setRemoveDialogVisible(false);

    }catch(err){
      console.log(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSong(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    setValue(e.value);
    setNewSong(prev => ({ ...prev, to: e.value.reduce((partialSum:any, a: number) => partialSum + a, 0) }));
  };

  const handleRemoveSelectChange = (e: any) => {
    setRemoveValue(e.value);
  };

  const actionBodyTemplate = (rowData: TSong) => {
    return (
      <>
        <Button type="button" icon="pi pi-trash" className="p-button-secondary" onClick={() => {
          setSelectedSong(rowData);
          setRemoveDialogVisible(true);
        }}></Button>
      </>
    );
  };

  const fromBodyTemplate = (rowData: TSong) => {
    let tagValue: string;

    if (rowData.from.length > 1 || rowData.from.includes("ALL")) {
      tagValue = "ALL";
      return <Tag value={tagValue} severity="info"></Tag>;
    } else if (rowData.from.includes("db1")) {
      tagValue = "db1";
      return <Tag value={tagValue} severity="success"></Tag>;
    } else {
      tagValue = "db2";
      return <Tag value={tagValue} severity="warning"></Tag>;
    }
  };

  return (
    <div>
      <div className="card">
        <Button label="Add New Song" icon="pi pi-plus" onClick={() => setDialogVisible(true)} />
        <DataTable value={songs} showGridlines tableStyle={{ minWidth: '50rem' }}>
          <Column field="title" header="Title"></Column>
          <Column field="from" header="Database" body={fromBodyTemplate}></Column>
          <Column header="Action" body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog
        header="Add New Song"
        visible={dialogVisible}
        style={{ width: '50vw' }}
        onHide={() => setDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={newSong.title}
              onChange={handleInputChange}
              className="p-inputtext p-component"
            />
          </div>
          <div className="p-field">
            <label htmlFor="from">Database</label>
            <SelectButton value={value} onChange={handleSelectChange} optionLabel="name" options={items} multiple />
          </div>
          <Button label="Add Song" icon="pi pi-check" onClick={handleAddSong} />
        </div>
      </Dialog>

      <Dialog
        header="Remove Song"
        visible={removeDialogVisible}
        style={{ width: '50vw' }}
        onHide={() => setRemoveDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="remove">Remove From</label>
            <SelectButton
              value={removeValue}
              onChange={handleRemoveSelectChange}
              optionLabel="name"
              options={selectedSong ? removeOptions(selectedSong.from) : []}
            />
          </div>
          <Button label="Remove Song" icon="pi pi-check" onClick={handleRemoveSong} />
        </div>
      </Dialog>
    </div>
  );
}

export default App;
