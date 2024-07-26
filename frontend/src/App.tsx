import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { SelectButton } from "primereact/selectbutton";

export type TSong = {
  id: string,
  title: string,
  from: Array<string>
}

function App() {
  const [songs, setSongs] = useState<TSong[]>([
    {
      id: "acf6fd4c-e2de-40a9-a164-d5a0258cbdd9",
      title: "topis",
      from: ["db1"]
    },
    {
      id: "f061b085-aae8-4cc0-b583-9357c885117b",
      title: "dont blame me 58",
      from: ["db1", "db2"]
    },
    {
      id: "3d5a4313-fcf1-42d9-abad-39328416adbe",
      title: "dont blame me 5",
      from: ["db2"]
    },
    {
      id: "9c0cd1e0-4d0c-4ed6-a878-b61e710eea13",
      title: "dont blame me",
      from: ["db2"]
    },
    {
      id: "9feb58f0-d4fe-40c1-b935-94b13210b063",
      title: "harmonic",
      from: ["db2"]
    }
  ]);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [removeDialogVisible, setRemoveDialogVisible] = useState(false);
  const [newSong, setNewSong] = useState<TSong>({ id: "", title: "", from: [] });
  const [value, setValue] = useState<string[]>([]);
  const [removeValue, setRemoveValue] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<TSong | null>(null);

  const items = [
    { name: 'Database 1', value: 'db1' },
    { name: 'Database 2', value: 'db2' }
  ];

  const removeOptions = (from: string[]) => {
    let options = [];
    if (from.includes('db1')) options.push({ name: 'Database 1', value: 'db1' });
    if (from.includes('db2')) options.push({ name: 'Database 2', value: 'db2' });
    if (from.length === 2) options.push({ name: 'All', value: 'ALL' });
    return options;
  };

  const handleAddSong = () => {
    setSongs([...songs, { ...newSong, id: Date.now().toString() }]);
    setNewSong({ id: "", title: "", from: [] });
    setDialogVisible(false);
  };

  const handleRemoveSong = () => {
    if (selectedSong) {
      setSongs(songs.map(song => {
        if (song.id === selectedSong.id) {
          if (removeValue === 'ALL') {
            return { ...song, from: [] };
          } else {
            return {
              ...song,
              from: song.from.filter(db => db !== removeValue)
            };
          }
        }
        return song;
      }));
      setRemoveDialogVisible(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSong(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    setValue(e.value);
    setNewSong(prev => ({ ...prev, from: e.value }));
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
