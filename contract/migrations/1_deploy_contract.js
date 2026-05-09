const MedicineSupplyChain = artifacts.require("MedicineSupplyChain");

module.exports = async function (deployer) {
  await deployer.deploy(MedicineSupplyChain);
};
