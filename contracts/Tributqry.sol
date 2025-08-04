// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Tributqry {
    IERC20 public usdcToken;  // Reference vers USDC
    
    constructor(address _usdcAddress) {
        usdcToken = IERC20(_usdcAddress);
    }

    enum InvoiceStatus { UNPAID, PAID, CANCELLED }           

    struct Invoice {
        address issuer;
        address client;
        address contractor;
        InvoiceStatus status;
        //string metadata;
        uint amount;
        uint paidAt;
    }

    mapping(bytes32 => Invoice) invoices;
   
    event InvoiceCreated(bytes32 indexed invoiceId, address indexed contractor, address indexed client);

    event InvoicePaid(bytes32 indexed invoiceId, address indexed client, address indexed contractor, uint amount);

    function createInvoice(address _contractor, address _client , uint _amount) public{
        require(msg.sender == _contractor, "Only contractor can create invoice");
        require(_contractor != _client, "The client cannot be the contractor");
        require(_amount > 0, "The amount of the contract cannot be 0");//change the minimum amount in the future
        bytes32 invoiceId = _generateInvoiceId(msg.sender, _contractor, _client);
        
        invoices[invoiceId] = Invoice(msg.sender, _client, _contractor, InvoiceStatus.UNPAID, _amount, 0);

        emit InvoiceCreated(invoiceId, _contractor, _client);

    }
    function getInvoice(bytes32 _invoiceId) public view returns(Invoice memory){
        require(invoices[_invoiceId].client != address(0), "Invoice does not exists");
        return invoices[_invoiceId];
    }

    function _generateInvoiceId(address _issuer, address _contractor, address _client) private view returns(bytes32){
        return keccak256(abi.encodePacked(_issuer, _contractor, _client, block.timestamp));
    }
    

    function payInvoice(bytes32 _invoiceId) public {
        Invoice storage invoice = invoices[_invoiceId];

        require(invoice.client != address(0));
        require(msg.sender == invoice.client);
        require(invoice.status == InvoiceStatus.UNPAID );
        

        require(usdcToken.allowance(msg.sender, address(this)) >= invoice.amount); 
        require(usdcToken.balanceOf(msg.sender) >= invoice.amount);

        _transfertFrom(invoice.client, invoice.contractor, invoice.amount);
        
        invoice.status = InvoiceStatus.PAID;
        invoice.paidAt = block.timestamp;

        emit InvoicePaid(_invoiceId, invoice.client, invoice.contractor, invoice.amount);
    }
    function _transfertFrom(address _from, address _to,uint256 _amount) private{
        usdcToken.transferFrom(_from, _to, _amount);
    }

}
