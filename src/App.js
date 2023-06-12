import React, { useState } from "react";

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

const App = () => {
	// State
	const [showFriendForm, setShowFriendForm] = useState(false);
	const [friends, setFriends] = useState(initialFriends);
	const [selectedFriend, setSelectedFriend] = useState(null);

	// Handle Open/Close of friend info form
	const handleFriendForm = () => {
		setShowFriendForm((c) => !c);
	};

	// Handle Form Submit To Add New Friend
	const handleAddFriend = (newFriend) => {
		setFriends((f) => [...f, newFriend]);
		setShowFriendForm(false);
	};

	// Handle Selecting Friend
	const handleSelectedFriend = (friend) => {
		setSelectedFriend(friend);
	};

	return (
		<div className="app">
			<div className="sidebar">
				<FriendList
					friends={friends}
					onFriendSelect={handleSelectedFriend}
				/>
				{showFriendForm && (
					<AddFriendForm
						isFormOpen={showFriendForm}
						onSubmit={handleAddFriend}
					/>
				)}
				<Button onClick={handleFriendForm}>
					{showFriendForm ? "Close" : "Add Friend"}
				</Button>
			</div>
			{selectedFriend && <SplitBillForm friend={selectedFriend} />}
		</div>
	);
};

const FriendList = ({ friends, onFriendSelect }) => {
	return (
		<ul>
			{friends.map((f) => (
				<Friend friend={f} key={f.id} onFriendSelect={onFriendSelect} />
			))}
		</ul>
	);
};

const Friend = ({ friend, onFriendSelect }) => {
	return (
		<li>
			<img src={friend.image} alt={friend.name} />
			<h3>{friend.name}</h3>
			{friend.balance === 0 ? (
				<p>You and {friend.name} are even</p>
			) : friend.balance > 0 ? (
				<p className="green">
					{friend.name} owes you {friend.balance}
				</p>
			) : (
				<p className="red">
					You owe {friend.name} {friend.balance}
				</p>
			)}
			<Button onClick={() => onFriendSelect(friend)}>Select</Button>
		</li>
	);
};

const AddFriendForm = ({ onSubmit }) => {
	// State for controlled form elements
	const [name, setName] = useState("");
	const [image, setImage] = useState("https://i.pravatar.cc/48");

	const handleSubmit = (e) => {
		e.preventDefault();

		// Guard Clause
		if (!name || !image) return;

		// Creating New Friend obj
		const id = crypto.randomUUID();
		const newFriend = {
			name,
			image: `${image}${id}`,
			balance: 0,
			id,
		};

		// Add Friend to state(lifted up to App component)
		onSubmit(newFriend);

		// Go back to default values on controlled elements
		setImage("https://i.pravatar.cc/48");
		setName("");
	};

	return (
		<form className="form-add-friend" onSubmit={handleSubmit}>
			<label>🙍🏼 Friend name</label>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<label>🖼️ Image Url</label>
			<input
				type="text"
				value={image}
				onChange={(e) => setImage(e.target.value)}
			/>
			<Button>Add</Button>
		</form>
	);
};

const SplitBillForm = ({ friend }) => {
	return (
		<form className="form-split-bill">
			<h2>Splitting Bill With {friend.name}</h2>
			<label>💳 Bill Value</label>
			<input type="text" />
			<label>🙋🏼 Your Expense</label>
			<input type="text" />
			<label>🤵🏼 {friend.name}'s Expense</label>
			<input type="text" disabled />
			<label>🤑 Who's Paying The Bill?</label>
			<select>
				<option value="user">You</option>
				<option value="friend">X</option>
			</select>
			<Button>Add</Button>
		</form>
	);
};

const Button = ({ children, onClick }) => {
	return (
		<button className="button" onClick={onClick}>
			{children}
		</button>
	);
};

export default App;
