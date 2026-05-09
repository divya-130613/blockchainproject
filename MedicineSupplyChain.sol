// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicineSupplyChain {

    // 👥 Roles
    enum Role { None, Manufacturer, Distributor, Pharmacy }
    mapping(address => Role) public roles;

    // 📦 Batch Structure
    struct Batch {
        uint id;
        string name;
        address manufacturer;
        address currentOwner;
        uint timestamp;
        string status;
    }

    mapping(uint => Batch) public batches;
    uint public batchCount = 0;

    // 📢 Events
    event BatchCreated(uint id);
    event BatchTransferred(uint id, address from, address to);

    // 🔐 Register Role
    function registerRole(address _user, Role _role) public {
        roles[_user] = _role;
    }

    // 🏭 Create Batch (ONLY Manufacturer)
    function createBatch(string memory _name) public {
        registerRole(YOUR_METAMASK_ADDRESS, 1)
        batchCount++;

        batches[batchCount] = Batch(
            batchCount,
            _name,
            msg.sender,
            msg.sender,
            block.timestamp,
            "Created"
        );

        emit BatchCreated(batchCount);
    }

    // 🔄 Transfer Batch
    function transferBatch(uint _id, address _to) public {
        Batch storage batch = batches[_id];

        require(batch.currentOwner == msg.sender, "Not current owner");

        // Manufacturer → Distributor
        if (roles[msg.sender] == Role.Manufacturer) {
            require(roles[_to] == Role.Distributor, "Send to Distributor only");
            batch.status = "In Transit";
        }

        // Distributor → Pharmacy
        else if (roles[msg.sender] == Role.Distributor) {
            require(roles[_to] == Role.Pharmacy, "Send to Pharmacy only");
            batch.status = "Delivered";
        }

        else {
            revert("Invalid role");
        }

        batch.currentOwner = _to;

        emit BatchTransferred(_id, msg.sender, _to);
    }

    // 🔍 Get Batch Details
    function getBatch(uint _id) public view returns (
        uint, string memory, address, address, uint, string memory
    ) {
        Batch memory b = batches[_id];
        return (b.id, b.name, b.manufacturer, b.currentOwner, b.timestamp, b.status);
    }
}