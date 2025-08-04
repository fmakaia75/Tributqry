const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
import { expect } from "chai";
import hre from "hardhat";

describe("Tributqryi tests", function () {
        const INVOICE_AMOUNT = 500;
        async function deployTributqryFixture(){
        
            const [deployer, contractor, client, randomUser] = await ethers.getSigners();
            
            const TributqryFactory = await ethers.getContractFactory("Tributqry");
            const tributqry = await TributqryFactory.deploy(ethers.ZeroAddress);
    
            return { tributqry, deployer, contractor, client, randomUser };
        }

        it("Create Valid Invoice", async function () {
            const { tributqry, contractor, client } = await loadFixture(deployTributqryFixture);

            let tx = await tributqry.connect(contractor).createInvoice(contractor.address, client.address, INVOICE_AMOUNT);

            let receipt = await tx.wait();
            let event = receipt.logs[0]; // Fisrt event
            let invoice = event.args
            
            await expect(tx).to.emit(tributqry, "InvoiceCreated");
            expect(invoice.contractor).to.equal(contractor.address);
            expect(invoice.client).to.equal(client.address);
            
        });

        it("Create Invalid Invoice with ammount ->0", async function () {
            const { tributqry, contractor, client } = await loadFixture(deployTributqryFixture);

            await expect(tributqry.connect(contractor).createInvoice(contractor.address, client.address, 0))
            .to.be.revertedWith("The amount of the contract cannot be 0");            
        });

        it("Create Invalid Invoice Contractor == Client ", async function () {
            const { tributqry, contractor, client } = await loadFixture(deployTributqryFixture);

            await expect(tributqry.connect(contractor).createInvoice(contractor.address, contractor.address, INVOICE_AMOUNT))
            .to.be.revertedWith("The client cannot be the contractor");            
        });
        
        it("Random user try to create Invoice for a contractor", async function () {
            const { tributqry, contractor, client } = await loadFixture(deployTributqryFixture);
            
            await expect(tributqry.createInvoice(contractor.address, client.address, INVOICE_AMOUNT))
            .to.be.revertedWith("Only contractor can create invoice");            
        });

        it("Get Valid Invoice details", async function (){
            
            const { tributqry, contractor, client } = await loadFixture(deployTributqryFixture);
 
            let tx = await tributqry.connect(contractor).createInvoice(contractor.address, client.address, INVOICE_AMOUNT);

            let receipt = await tx.wait();
            let event = receipt.logs[0]; // First event
            let invoiceEvent = event.args

            let invoiceDetails = await tributqry.getInvoice(invoiceEvent.invoiceId);

            expect(invoiceDetails.client).to.equal(client.address);
            expect(invoiceDetails.contractor).to.equal(contractor.address);
            expect(invoiceDetails.amount).to.equal(INVOICE_AMOUNT);
            expect(invoiceDetails.paidAt).to.equal(0);
            expect(invoiceDetails.status).to.equal(0);


        } );

        it("Get Invalid Invoice details", async function (){
            
            const { tributqry, contractor, client } = await loadFixture(deployTributqryFixture);
 
            const invalidAddress = "0x0000000000000000000000000000000000000000000000000000000000000000"; 
            await expect(tributqry.getInvoice(invalidAddress))
            .to.be.revertedWith("Invoice does not exists");

        } );
})
