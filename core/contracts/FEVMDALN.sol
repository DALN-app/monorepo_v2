// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/Base64Upgradeable.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FEVM_DALN is
  ERC721Upgradeable,
  ERC721BurnableUpgradeable,
  ERC721URIStorageUpgradeable,
  ERC721HolderUpgradeable,
  PausableUpgradeable,
  OwnableUpgradeable,
  ReentrancyGuardUpgradeable,
  UUPSUpgradeable
{
  using CountersUpgradeable for CountersUpgradeable.Counter;
  using StringsUpgradeable for uint256;

  CountersUpgradeable.Counter public _tokenIds;

  string public _baseURIString;
  string public _metadataTable;
  uint256 public _metadataTableId;
  string public _tablePrefix;
  string public _externalURL;

  event Initialized(string _baseURIString);
  event MetadataTableSet(string _metadataTable);

  mapping(address => bool) private _hasMinted;

  function initialize(string memory baseURI, string memory externalURL) public initializer {
    __ERC721_init("FEVM_DALN", "DALN");
    __ERC721URIStorage_init();
    __ERC721Holder_init();
    __Ownable_init();
    __ReentrancyGuard_init();
    __Ownable_init_unchained();
    __Pausable_init();
    __ReentrancyGuard_init();

    _baseURIString = baseURI;
    _tablePrefix = "DALN_DATA";
    _externalURL = externalURL;
    emit Initialized(_baseURIString);
  }

  /*
   * `createMetadataTable` initializes the token tables.
   */
  function createMetadataTable() external payable onlyOwner returns (uint256) {
    _metadataTableId = TablelandDeployments.get().create(
      address(this),
      SQLHelpers.toCreateFromSchema(
        "id integer primary key,"
        "address text,"
        "time text",
        _tablePrefix
      )
    );

    require(_metadataTableId != 0, "Table creation failed!");

    _metadataTable = SQLHelpers.toNameFromId(_tablePrefix, _metadataTableId);
    emit MetadataTableSet(_metadataTable);

    return _metadataTableId;
  }

  /*
   * `safeMint` allows anyone to mint a token in this project.
   * Any time a token is minted, a new row of metadata will be
   * dynamically inserted into the metadata table.
   */
  function safeMint(address to) public returns (uint256) {
    require(!_hasMinted[to], "Address has already minted a token");

    uint256 newItemId = _tokenIds.current();

    string memory query;
    {
      query = string.concat(
        Strings.toString(newItemId), // Convert to a string
        ",",
        SQLHelpers.quote(Strings.toHexString(to)),
        ",",
        SQLHelpers.quote(Strings.toString(block.timestamp))
      );
    }

    TablelandDeployments.get().mutate(
      address(this),
      _metadataTableId,
      SQLHelpers.toInsert(
        _tablePrefix, // prefix
        _metadataTableId, // table id
        "id,address,time", // column names
        query // values
      )
    );
    _hasMinted[to] = true;
    _safeMint(to, newItemId, "");
    _tokenIds.increment();
    return newItemId;
  }

  /*
   * `_baseURI` returns the base token URI.
   */
  function _baseURI() internal view override returns (string memory) {
    return _baseURIString;
  }

  /*
   * `setExternalURL` provides an example of how to update a field for every
   * row in an table.
   */
  function setExternalURL(string calldata externalURL) external onlyOwner {
    _externalURL = externalURL;
  }

  function metadataURI() public view returns (string memory) {
    string memory base = _baseURI();
    return
      string.concat(
        base,
        "query?statement=", // Simple read query setup
        "SELECT%20*%20FROM%20",
        _metadataTable
      );
  }

  function userBurn(uint256 tokenId) public {
    require(ownerOf(tokenId) == msg.sender, "You do not own this SBT");

    TablelandDeployments.get().mutate(
      address(this),
      _metadataTableId,
      SQLHelpers.toDelete(
        _tablePrefix, // prefix
        _metadataTableId, // table id
        string.concat("id = ", Strings.toString(tokenId), ";")
      )
    );

    _burn(tokenId);
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override {
    require(from == address(0) || to == address(0), "This a soulbound token");
    super._beforeTokenTransfer(from, to, tokenId, batchSize);
  }

  function _authorizeUpgrade(address) internal view override onlyOwner {}

  // The following functions are overrides required by Solidity.
  function _burn(uint256 tokenId) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
    super._burn(tokenId);
  }

  function tokenURI(
    uint256 tokenId
  ) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
