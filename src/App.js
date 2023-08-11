import { useState } from "react";
import "./App.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

export default function App() {
  const [frinds, setFrinds] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handlAddFrinds(friend) {
    setFrinds((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function hadlShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function hadlselectedFriend(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handlsplitBill(value) {
    // setFrinds((frinds) => frinds.map(friend)=> friend.id===selectedFriend.id ? {...friend, balance : friend.balance + value} : friend);
    setFrinds((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FrindsList
          frinds={frinds}
          OnSelection={hadlselectedFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onaddfrinds={handlAddFrinds} />}
        <Button onClick={hadlShowAddFriend}>
          {showAddFriend ? "close" : "Add Frien"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onsplitBill={handlsplitBill}
        />
      )}
    </div>
  );
}

function FrindsList({ OnSelection, frinds, selectedFriend }) {
  return (
    <div>
      <ul>
        {frinds.map((frind) => (
          <Frinds
            frind={frind}
            key={frind.id}
            OnSelection={OnSelection}
            selectedFriend={selectedFriend}
          />
        ))}
      </ul>
    </div>
  );
}

function Frinds({ OnSelection, frind, selectedFriend }) {
  const isSelected = selectedFriend?.id === frind.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={frind.image} alt={frind.name} />
      <h3>{frind.name}</h3>

      {frind.balance < 0 && ( //الشرط الأول
        <p className="red">
          you own {frind.name} {Math.abs(frind.balance)}
        </p>
      )}
      {frind.balance > 0 && ( //الشرط الثاني ل
        <p className="green">
          {frind.name} owes you {Math.abs(frind.balance)}
        </p>
      )}
      {frind.balance === 0 && <p>you own {frind.name} ara even</p>}

      <Button onClick={() => OnSelection(frind)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onaddfrinds }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=11883");

  function handlSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const NewFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onaddfrinds(NewFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handlSubmit}>
      <label> 👫Frind name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label> 🌄 img url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add Frind</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onsplitBill }) {
  const [bill, setBill] = useState("");
  const [paydByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paydByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paydByUser) return;
    onsplitBill(whoIsPaying === "user" ? paidByFriend : -paydByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a Bill With {selectedFriend.name} </h2>

      <label>💰 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍 your Expence</label>
      <input
        type="text"
        value={paydByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paydByUser : Number(e.target.value)
          )
        }
      />

      <label> 👫 {selectedFriend.name} 's Expence</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who Is Paying The Bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name} </option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
