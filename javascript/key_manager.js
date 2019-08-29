// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////////

goog.module('tink.KeyManager');

const PbKeyData = goog.require('proto.google.crypto.tink.KeyData');
const PbMessage = goog.require('jspb.Message');

/**
 * An auxiliary container for methods that generate new keys.
 * Those methods are separate from KeyManager as their functionality is
 * independent of the primitive of the corresponding KeyManager.
 *
 * @record
 */
class KeyFactory {
  /**
   * Generates a new random key according to 'keyFormat'.
   *
   * @param {!PbMessage|!Uint8Array} keyFormat is either a KeyFormat
   *     proto or a serialized KeyFormat proto
   * @return {!PbMessage|!Promise<!PbMessage>} the new generated key
   */
  newKey(keyFormat) {}

  /**
   * Generates a new random key based on the "serialized_key_format" and returns
   * it as a KeyData proto.
   *
   * @param {!Uint8Array} serializedKeyFormat
   * @return {!PbKeyData|!Promise<!PbKeyData>}
   */
  newKeyData(serializedKeyFormat) {}
}

/**
 * @record
 * @extends {KeyFactory}
 */
class PrivateKeyFactory {
  /**
   * Returns a public key data extracted from the given serialized private key.
   *
   * @param {!Uint8Array} serializedPrivateKey
   * @return {!PbKeyData}
   */
  getPublicKeyData(serializedPrivateKey) {}
}

/**
 * A KeyManager "understands" keys of a specific key type: it can generate keys
 * of the supported type and create primitives for supported keys.
 * A key type is identified by the global name of the protocol buffer that holds
 * the corresponding key material, and is given by typeUrl-field of
 * KeyData-protocol buffer.
 *
 * The template parameter P denotes the primitive corresponding to the keys
 * handled by this manager.
 *
 * @template P
 * @record
 */
class KeyManager {
  /**
   * Constructs an instance of primitive P for a given key.
   *
   * @param {!Object} primitiveType
   * @param {!PbKeyData|!PbMessage} key is either a KeyData proto or a supported
   *     key proto
   * @return {!Promise.<!P>}
   */
  getPrimitive(primitiveType, key) {}

  /**
   * Returns true if this KeyManager supports keyType.
   *
   * @param {string} keyType
   * @return {boolean}
   */
  doesSupport(keyType) {}

  /**
   * Returns the URL which identifies the keys managed by this KeyManager.
   *
   * @return {string}
   */
  getKeyType() {}

  /**
   * Returns the type of primitive which can be generated by this KeyManager.
   *
   * This function is specific for javascript to allow verifying that
   * the primitive returned by getPrimitive function implements certain
   * primitive interface (e.g. that the primitive is AEAD).
   *
   * @return {!Object}
   */
  getPrimitiveType() {}

  /**
   * Returns the version of this KeyManager.
   *
   * @return {number}
   */
  getVersion() {}

  /**
   * Returns a factory that generates keys of the key type handled by this
   * manager.
   *
   * @return {!KeyFactory}
   */
  getKeyFactory() {}
}

exports = {
  KeyManager,
  KeyFactory,
  PrivateKeyFactory
};