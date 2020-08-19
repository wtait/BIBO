// Copyright (C) 2018  Argent Labs Ltd. <https://argent.xyz>

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.5.4 <0.7.0;

/**
 * @title IWallet
 * @dev Interface for the BaseWallet
 */
interface IWallet {
    function owner() external view returns (address);

    function setOwner(address _newOwner) external;

    function authorised(address) external view returns (bool);

    function authoriseModule(address _module, bool _value) external;

    function enableStaticCall(address _module, bytes4 _method) external;
}